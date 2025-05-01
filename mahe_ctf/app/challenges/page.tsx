import React from 'react';
import {TeamStats} from "@/components/team-stats";
import {ChallengeCategories} from "@/components/challenge-categories";

const ChallengesPage = async () => {
    return (
        <div className="container py-6 space-y-8">
          <h1 className="text-3xl">Adventure Dashboard</h1>
          <TeamStats />
          <div className="space-y-4">
            <h2 className="text-2xl">Quest Categories</h2>
            <ChallengeCategories />
          </div>
        </div>
    );
};

export default ChallengesPage;